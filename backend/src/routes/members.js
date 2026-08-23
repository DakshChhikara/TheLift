const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const Member = require("../models/Member");

const router = express.Router();



// ========================================
// ADD NEW MEMBER
// ========================================

router.post("/", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      plan,
      feesPaid,
      membershipStart,
      membershipExpiry,
    } = req.body;



    if (!name || !email || !phone) {

      return res.status(400).json({

        message: "Name, email and phone are required",

      });

    }



    const normalizedEmail = email.toLowerCase().trim();



    // Check existing login

    const existingUser = await User.findOne({

      email: normalizedEmail,

    });



    if (existingUser) {

      return res.status(400).json({

        message: "A user with this email already exists",

      });

    }



    // Generate password

    const temporaryPassword = crypto
      .randomBytes(4)
      .toString("hex");



    const hashedPassword = await bcrypt.hash(

      temporaryPassword,

      10

    );



    // Create User login

    const user = await User.create({

      name,

      email: normalizedEmail,

      password: hashedPassword,

      role: "member",

    });



    try {


      // Create Member profile

      const member = await Member.create({

        userId: user._id,

        name,

        email: normalizedEmail,

        phone,

        plan: plan || "Starter",

        feesPaid: feesPaid || 0,

        membershipStart:
          membershipStart || new Date(),

        membershipExpiry,

        status:"Active",

      });




      res.status(201).json({

        message:"Member created successfully",


        credentials:{

          email:normalizedEmail,

          temporaryPassword,

        },


        member,

      });



    } catch(error){


      await User.findByIdAndDelete(user._id);

      throw error;


    }



  } catch(error){


    console.error(
      "Add member error:",
      error
    );


    res.status(500).json({

      message:"Server error",

      error:error.message,

    });


  }


});







// ========================================
// GET ALL MEMBERS
// ========================================


router.get("/", async(req,res)=>{


  try{


    const members = await Member.find()

      .sort({
        createdAt:-1
      });



    res.json({

      members,

    });



  }catch(error){


    console.error(
      "Get members error:",
      error
    );


    res.status(500).json({

      message:"Server error",

      error:error.message,

    });


  }


});








// ========================================
// DELETE MEMBER
// ========================================


router.delete("/:id", async(req,res)=>{


  try{


    const member = await Member.findById(
      req.params.id
    );



    if(!member){


      return res.status(404).json({

        message:"Member not found",

      });


    }




    // Delete login account

    if(member.userId){


      await User.findByIdAndDelete(

        member.userId

      );


    }





    // Delete member profile

    await Member.findByIdAndDelete(

      req.params.id

    );




    res.json({

      message:"Member deleted successfully",

    });



  }catch(error){


    console.error(

      "Delete member error:",

      error

    );



    res.status(500).json({

      message:"Server error",

      error:error.message,

    });


  }



});






module.exports = router;