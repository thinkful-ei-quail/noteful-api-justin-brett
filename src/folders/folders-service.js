const FoldersService = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },
  insertFolders(knex, newFolders) {
    // return Promise.resolve({});
    return knex
      .insert(newFolders)
      .into("folders")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, folders_id) {
    return knex
      .from("folders")
      .select("*")
      .where("folders_id", folders_id)
      .first();
  },
  deleteFolders(knex, folders_id) {
    return knex("folders").where({ folders_id }).delete();
  },
  updateFolders(knex, folders_id, newFoldersFields) {
    return knex("folders").where({ folders_id }).update(newFoldersFields);
  },
};

module.exports = FoldersService;
