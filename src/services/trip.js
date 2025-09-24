import expressAsyncHandler from "express-async-handler";
import Trip from "../models/trip.js";
import { sendMail } from "../utilis/sendMail.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import fs from "fs";

const create = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const trip = await Trip.create({ ...req.body, user: id });
  res.status(201).json(trip);
});

const findAll = expressAsyncHandler(async (req, res) => {
  const trips = await Trip.find({ 
    $or:[
      { user: req.user.id }, // User's own trips.
      { collaborators: req.user.id } // Trips where the user is a collaborator
      //{collaborators: {$in: [req.user.id]}} // Alternative way to check if user is in collaborators array ..
    ],
   });
  res.status(200).json(trips);
});

const findById = expressAsyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json(trip);
});

const update = expressAsyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      ...(req.body.title && { title: req.body.title }), //request body ma title   aako xa ki xaina vanera check garyaa ,aako xa vaney update garney
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.startDate && { startDate: req.body.startDate }),
      ...(req.body.endDate && { endDate: req.body.endDate }),
      ...(req.body.destinations && { destinations: req.body.destinations }),
      ...(req.body.budget && { budget: req.body.budget }),
    },
    { new: true }
  );
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json(trip);
});

const remove = expressAsyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json({ message: "Trip deleted successfully" });
});

const addExpenses = expressAsyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
      $or: [{user: req.user._id},{collaborators:req.user.userId}]
  });
  
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const date = req.body.date || new Date();
  trip.budget.expenses.push({
    ...req.body,
    date,
  });

  trip.budget.spent += req.body.amount || 0;
  await trip.save();

  res.status(200).json(trip);
});

const inviteCollaborators = expressAsyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate("user","name");

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  const token = jwt.sign({ tripId: req.params.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const invitationLink = `http://localhost:5000/trips/${trip._id}/invite/accept?token=${token}`;
  //await sendMail(req.body.email, "Invitation to collaborate", invitationLink);
  await sendMail(req.body.email,"Invitation to collaborate",{
    title: trip.title,
    startDate: trip.startDate.toDateString(),
    endDate: trip.endDate.toDateString(),
    userName:trip.user.name,
    link:invitationLink,
  });
  res.status(200).json({ message: "Invitation sent successfully" });
});

const acceptInvitation = expressAsyncHandler(async (req, res) => {
  const { token } = req.query;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const trip = await Trip.findById(decoded.tripId);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  trip.collaborators.push(req.user.id);
  await trip.save();
  res.status(200).json({ message: "invitation accepted successfully" });
});

const uploadFiles = expressAsyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    $or: [{ user: req.user._id }, { collaborators: req.user.id }],
  });

  if (!trip) {
    res.status(404);
    throw new Error("you can upload up to 4 images/videos");

  }

  await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto", // Automatically determine resource type (image/video)
      folder:`wander-wise/trips/${trip.title}_${trip._id}`,
      overwrite: false,
      use_filename: true, // Use original file name
      unique_filename: false, // Do not generate a unique filename
      });

      trip.files.push(result.secure_url);
      fs.unlinkSync(file.path); // Delete the file from local storage after upload
    })
  );

  await trip.save();

  res.status(200).json(trip);
});

export {
  create,
  findAll,
  findById,
  update,
  remove,
  addExpenses,
  inviteCollaborators,
  acceptInvitation,
  uploadFiles,
};
