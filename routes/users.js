import express from 'express';
const router = express.Router();

router
  .route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
    console.log(req.body);
    res.send('success');
  });

export default router;
