const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  

  const events= await Event.find().populate('user','name');

  return res.json({
    ok: true,
    events
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;

    const eventSaved = await event.save();

    return res.json({
      ok: true,
      event: eventSaved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk with the admin",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid= req.uid;   
  try {
    const event=await Event.findById(eventId);

    if(!event){
      return res.status(404).json({
        ok:false,
        msg:'The event does not exists with that id'
      })
    }

    if(event.user.toString() !== uid){
      return res.status(401).json({
        ok:false,
        ms:'You dont have privilege to edit this event'
      })
    }

    const newEvent= {
      ...req.body,
      user:uid
    }

    const eventUpdated= await Event.findByIdAndUpdate(eventId,newEvent,{new:true});

    return res.json({
      ok:true,
      event:eventUpdated 
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok:false,
      msg:'Talk with the admin'
    })
  }

};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid= req.uid;   
  try {
    const event=await Event.findById(eventId);

    if(!event){
      return res.status(404).json({
        ok:false,
        msg:'The event does not exists with that id'
      })
    }

    if(event.user.toString() !== uid){
      return res.status(401).json({
        ok:false,
        ms:'You dont have privilege to delete this event'
      })
    }

   

    await Event.findByIdAndDelete(eventId);

    return res.json({
      ok:true
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok:false,
      msg:'Talk with the admin'
    })
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
 