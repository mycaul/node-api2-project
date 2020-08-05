const express = require('express');
const Posts = require('./data/db');

const router = express.Router();

router.post('/', (req, res) => {
  const newPost = req.body;

  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  } else {
    Posts.insert(newPost)
      .then((post) => {
        Posts.findById(post.id).then((newPost) => {
          res.status(201).json(newPost);
        });
      })
      .catch((err) => {
        res.status(500).json({
          error:
            'There was an error while saving the post to the database',
        });
      });
  }
});

router.post('/:id/comments', (req, res) => {
  const newComment = req.body;
  const id = req.params.id;
  newComment.post_id = Number(id);

  if (!newComment.text) {
    res.status(400).json({
      errorMessage: 'Please provide text for the comment.',
    });
  } else {
    Posts.findCommentById(req.params.id)
      .then((post) => {
        if (post.length === 0) {
          res.status(404).json({
            message: 'The post with the specified ID does not exist.',
          });
        } else {
          Posts.insertComment(newComment).then((post) => {
            if (post === 0) {
              res.status(400).json({
                errorMessage: 'Please provide text for the comment.',
              });
            } else {
              res.status(201).json(newComment);
            }
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: 'The comments information could not be retrieved.',
        });
      });
  }
});

router.get('/', (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'The posts information could not be retrieved.',
      });
    });
});

router.get('/:id/comments', (req, res) => {
  Posts.findPostComments(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: 'The comments information could not be retrieved.',
      });
    });
});

router.delete('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      Posts.remove(req.params.id)
        .then(() => {
          res.status(200).json(post);
        })
        .catch((err) => {
          res.status(500).json({
            error: 'The post could not be removed',
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        message: 'The post with the specified ID does not exist.',
      });
    });
});

router.put('/:id', (req, res) => {
  const updatePost = req.body;

  Posts.findById(req.params.id)
    .then(() => {
      if (!updatePost.title || !updatePost.contents) {
        res.status(400).json({
          errorMessage:
            'Please provide title and contents for the post.',
        });
      } else {
        Posts.update(updatePost)
          .then(() => {
            res.status(200).json(updatePost);
          })
          .catch((err) => {
            res.status(500).json({
              error: 'The post information could not be modified.',
            });
          });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: 'The post with the specified ID does not exist.',
      });
    });
});

module.exports = router;