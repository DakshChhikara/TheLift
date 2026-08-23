const express = require("express");

const Attendance = require("../models/Attendance");

const Member = require("../models/Member");


const router = express.Router();



// ========================================
// MARK ATTENDANCE
// ========================================

router.post("/", async(req,res)=>{


try{


const {

member,

status

} = req.body;



if(!member){

return res.status(400).json({

message:"Member id required"

});

}



// check if attendance already marked today

const today = new Date();

today.setHours(0,0,0,0);



const existing = await Attendance.findOne({

member,

date:{
$gte:today
}

});



if(existing){

return res.status(400).json({

message:"Attendance already marked"

});

}




const attendance = await Attendance.create({

member,

status:status || "Present"

});



res.status(201).json({

message:"Attendance marked",

attendance

});



}



catch(error){


console.log(error);


res.status(500).json({

message:"Server error",

error:error.message

});


}


});









// ========================================
// GET ALL ATTENDANCE
// ========================================


router.get("/", async(req,res)=>{


try{


const attendance = await Attendance.find()

.populate("member","name email phone")

.sort({

createdAt:-1

});



res.json({

attendance

});


}

catch(error){


res.status(500).json({

message:"Server error"

});


}


});









// ========================================
// TODAY GYM CAPACITY
// ========================================


router.get("/today", async(req,res)=>{


try{


const start = new Date();

start.setHours(0,0,0,0);



const end = new Date();

end.setHours(23,59,59,999);



const count = await Attendance.countDocuments({

date:{

$gte:start,

$lte:end

},

status:"Present"

});




res.json({

inside:count,

capacity:80,

available:80-count

});



}

catch(error){


res.status(500).json({

message:"Server error"

});


}


});









// ========================================
// MEMBER ATTENDANCE
// ========================================


router.get("/member/:id", async(req,res)=>{


try{


const data = await Attendance.find({

member:req.params.id

})

.sort({

date:-1

});



res.json({

attendance:data

});


}

catch(error){


res.status(500).json({

message:"Server error"

});


}


});




module.exports = router;