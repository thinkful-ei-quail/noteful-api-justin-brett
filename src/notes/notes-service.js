const NotesService = {
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  },

  insertNotes(knex, newNotes) {
    return knex
      .insert(newNotes)
      .into("notes")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, notes_id) {
    return knex.from("notes").select("*").where("notes_id", notes_id).first();
  },

  deleteNotes(knex, notes_id) {
    return knex("notes").where({ notes_id }).delete();
  },

  updateNotes(knex, notes_id, newNotesFields) {
    return knex("notes").where({ notes_id }).update(newNotesFields);
  },
};

module.exports = NotesService;
