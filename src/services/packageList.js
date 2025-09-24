import asyncHandler from "express-async-handler";
import PackageList from "../models/packageList.js";
import Trip from "../models/trip.js";

export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //  const packageList = await PackageList.create({ name });
  //res.status(201).json(packageList);
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.id,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  //const packageList = await PackageList.create({name,trip:trip._id});
  const packageList = await PackageList.create({
    name,
    trip: req.params.tripId,
    user: req.user.id,
  });
  res.status(201).json(packageList);
});

export const findAll = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.id,
  });

  if (!trip) {
    res.status(404);
    throw new Error(`Trip not found 123 ${req.params.tripId}, ${req.user.id}`);
  }

  const packageLists = await PackageList.find({
    trip: req.params.tripId,
    user: req.user.id,
  });

  res.status(200).json(packageLists);
});

// const packageLists = await PackageList.find();
//  res.status(200).json(packageLists);
//});

export const findById = asyncHandler(async (req, res) => {
  const { id, tripId } = req.params;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user.id,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const packageList = await PackageList.findOne({
    _id: id,
    trip: tripId,
    user: req.user.id,
  });

  if (!packageList) {
    res.status(404);
    throw new Error("Package list not found");
  }

  res.status(200).json(packageList);
});

/* const packageList = await PackageList.findById(id);
  if (!packageList) {
    res.status(404).json({ message: "Package list not found" });
    return;
  }
  res.status(200).json(packageList);
})*/

export const update = asyncHandler(async (req, res) => {
  const { id, tripId } = req.params;
  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user.id,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const packageList = await PackageList.findOneAndUpdate(
    {
      _id: id,
      trip: tripId,
      user: req.user.id,
    },
    {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.completed && { completed: req.body.completed }),
    },
    { new: true }
  );
  if (!packageList) {
    res.status(404);
    throw new Error("Package list not found");
  }
  res.status(200).json(packageList);
});

/*export const updateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  const packageList = await PackageList.findOneAndDelete({
    _id: id,
    trip:tripId,
  });

  if (!packageList) {
    res.status(404);
    throw new Error("Package list not found");
  }

  res.status(200).json({ message: "Package list deleted successfully" });
});

  /*const packageList = await PackageList.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      ...(req.body.completed && {
        completed: req.body.completed,
      }),
    },
    { new: true }
  );
  if (!packageList) {
    res.status(404).json({ message: "Package list not found" });
    return;
  }
  res.status(200).json(packageList);
});*/

export const remove = asyncHandler(async (req, res) => {
  const { id, tripId } = req.params;
  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user.id,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const packageList = await PackageList.findOneAndDelete({
    _id: id,
    trip: tripId,
    user: req.user.id,
  });
  if (!packageList) {
    res.status(404);
    throw new Error("Package list not found");
  }
  res.status(200).json({ message: "Package list deleted successfully" });
});
