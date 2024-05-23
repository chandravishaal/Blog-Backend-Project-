const express = require('express');
const router = express.Router();
const post = require('../models/post');
const user = require('../models/user');
const bcrypt = require('bcrypt');//encrypt and decrpyt
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 Check Login 
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }

}









/**
 * GET
 * Admin- Login Page
 */
router.get('/admin', async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    //const data = await Post.find();
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});



/**
 * POST/
 * Admin- Check Login 
 */

router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body; 

    const user1 = await user.findOne({ username }); 
    if (!user1) {
      return res.status(401).json({ message: 'Invalid credential' });
    } 
    const isPasswordValid = await bcrypt.compare(password, user1.password);

    if (!isPasswordValid) {    
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ userId: user1._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');


  } catch (error) {
    console.log(error);
  }
});

// router.post('/admin', async (req, res) => {
//   try {
//     console.log(req.body);
//     // Removing destructuring since username and password are not used
//     // const { username, password } = req.body;
//     res.redirect('/admin');

//   } catch (error) {
//     console.log(error);
//   }
// });


/**
 * POST/
 * Admin- Check register 
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user1 = await user.create({ username, password: hashedPassword });
      res.status(201).json({ message: 'User Created', user1 });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'User already in use' });
      }
      console.log("Error creating user", error);
      res.status(500).json({ message: 'Internal server error' })
    }

  } catch (error) {
    console.log(error);
  }
});



/**
 * GET/
 * Admin dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {

  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    const data = await post.find();
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

/**
 * get/
 * Admin- Create new Post
 */
router.get('/add-post', authMiddleware, async (req, res) => {

  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    const data = await post.find();
    res.render('admin/add-post', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

/**
 * POST/
 * Admin- Create new Post
 * middleware to check whether were logged in
 */

router.post('/add-post', authMiddleware, async (req, res) => {

  try {

    console.log(req.body);
    res.redirect('/dashboard');

    try {
      const newPost = new post({
        title: req.body.title,
        body: req.body.body
      });

      await post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }

});


/**
 * PUT/
 * Admin- Create new Post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {

  try {

    await post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }

});

/**
 * PUT/
 * Admin- Create new Post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {

  try {

    const locals = {
      title: "Edit Post",
      description: "Free Nodejs User Management System",
    };

    const data = await post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});

/**
 * DELETE/
 * Admin- delete Post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await post.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});


/**
 * DELETE/
 * Admin logout */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  //  res.json({message: 'Logout successful'});
  res.redirect('/');
});





module.exports = router;