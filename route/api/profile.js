const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')


//@route GET api/profile/me
//@desc  Get user's profile
//@access Private
router.get('/me',auth, async(req, res) => {
    try {
        //find user and populate it with [name, avatar] from the user model
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])

        if(!profile){
            return res.status(400).json({msg: "There is no profile for this user"});
        }
         res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

//@route POST api/profile
//@desc  Create/Update user profile
//@access Private
router.post('/',[auth,
    check('status','Status is required').not().isEmpty(),
    check('skills', 'Skills required').not().isEmpty()
], async(req, res) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

        const {company, website, location, bio, status, githubusername,skills, youtube, facebook, twitter, linkedin, instagram} = req.body;
        //Build Profile object
        const profileFields = {}
        profileFields.user = req.user.id
        if(company) profileFields.company = company
        if(website) profileFields.website = website
        if(location) profileFields.location = location
        if(bio) profileFields.bio = bio
        if(status) profileFields.status = status
        if(githubusername) profileFields.githubusername = githubusername
        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }
        //Build social object
        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube;
        if(facebook) profileFields.social.facebook = facebook;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({user: req.user.id})
            if(profile){
                profile = await Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields},{new: true})
                return res.json(profile)
            }
            profile = new Profile(profileFields);
            await profile.save()
            return  res.json(profile);
        }catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }

});

//@route GET api/profile
//@desc  Get all user profile
//@access public

router.get('/', async(req,res) => {
    try {
        const profiles = await Profile.find({}).populate('user', ['name', 'avatar'])
        res.send(profiles);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error'); 
    }
});

//@route GET api/profile/users/userID
//@desc  Get user profile By ID
//@access public
router.get('/users/:userID',async(req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.userID}).populate('user', ['name', 'avatar'])
        if(!profile) return res.status(400).json({msg: 'Profile not found'});
         res.json(profile);
    } catch (error) {
        console.log(error.message)
        if(error.kind == 'ObjectID'){
            return res.status(400).json({msg: "Profile not found"});
        }
        res.status(500).send('Server Error');
    }

});

//@route DELETE api/profile
//@desc  Delete profile, user and posts
//@access private

router.delete('/',auth, async(req,res) => {
    try {
        //Delete user profile
        await Profile.findOneAndRemove({user: req.user.id})
        //Delete user
        await User.findOneAndRemove({_id: req.user.id})

         res.json({msg: "User delete"});
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error'); 
    }
});

//@route PUT api/profile/experience
//@desc  create user experience
//@access private
router.put('/experience',[auth, [
    check('title','Title is required').not().isEmpty(),
    check('company','Company name is required').not().isEmpty(),
    check('from','Start date is required').not().isEmpty()
]], async(req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }
    const { title, company, location, from , to, current, description } = req.body

    const userExp = {title, company, location, from, to, current, description}
    try {
        let profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(userExp);
        await profile.save()
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: 'Server Error'});
    }
});

//@route delete api/profile/experience/id
//@desc  delete user experience
//@access private
router.delete('/experience/:expID',auth, async(req, res) => {
    try {
        let profile = await Profile.findOne({user: req.user.id})
        let expIndex = profile.experience.map(item => item.id).indexOf(req.params.expID);
        profile.experience.splice(expIndex,1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: "Server Error"});
    }
})

//@route PUT api/profile/education
//@desc  create user education
//@access private
router.put('/education',[auth, [
    check('school','School name is required').not().isEmpty(),
    check('degree','Degree type is required').not().isEmpty(),
    check('fieldofstudy','Field of study is required').not().isEmpty(),
    check('from','Start date is required').not().isEmpty()
]], async(req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body

    const userEdu = {school, degree, fieldofstudy, from, to, current, description}
    try {
        let profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(userEdu);
        await profile.save()
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: 'Server Error'});
    }
});

//@route delete api/profile/education/id
//@desc  delete user education
//@access private
router.delete('/education/:edu_ID',auth, async(req, res) => {
    try {
        let profile = await Profile.findOne({user: req.user.id})
        let edu_Index = profile.education.map(item => item.id).indexOf(req.params.edu_ID);
        profile.education.splice(edu_Index,1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: "Server Error"});
    }
})

module.exports = router ;
