const MenuItem = require("../models/menuItem-model");

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ company: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(item);
  } catch (err) {
    res.status(500).send(err);
  }
};
