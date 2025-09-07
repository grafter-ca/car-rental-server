// utils/insertDocument.js
const insertDocument = async (Model, data) => {
  try {
    if (!Array.isArray(data)) {
      const doc = new Model(data);
      await doc.save();
      return doc;
    }

    // If you pass an array, insert multiple documents
    const docs = await Model.insertMany(data);
    return docs;
  } catch (err) {
    console.error(`Error inserting into ${Model.modelName}:`, err);
    throw err;
  }
};

module.exports = insertDocument;
