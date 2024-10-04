const accessSchema = require("../schemas/accessSchema");

const rateLimiting = async (req, res, next) => {
  const sessionId = req.session.id;

  try {
    //check in db if sid exist or not
    const accessDb = await accessSchema.findOne({ sessionId });
    console.log(accessDb);

    if (!accessDb) {
      // this is request 1
      const accessObj = new accessSchema({
        sessionId,
        lastReqTime: Date.now(),
      });
      await accessObj.save();
      next();
      return;
    }

    //R2-Rnth
    console.log((Date.now() - accessDb.lastReqTime) / 1000);

    const diff = (Date.now() - accessDb.lastReqTime) / 1000;

    if (diff < 1) {
      return res.send({
        status: 429,
        message: "Too many request, please wait for some time.",
      });
    }

    await accessSchema.findOneAndUpdate(
      { sessionId },
      { lastReqTime: Date.now() }
    );
    next();
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = rateLimiting;
