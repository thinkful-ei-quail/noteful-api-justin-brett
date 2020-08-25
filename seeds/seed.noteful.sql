
INSERT INTO folders (folders_id, folders_name)
VALUES 
  (1, 'folder 1'),
  (2, 'folder 2'),
  (3, 'folder 3');


INSERT INTO notes (notes_id, notes_name, notes_content, folders_id)
VALUES
  (1, 'Note 1', 'Lorem ipsum dolor sit ametque?', 1),
  (2, 'Note 2', 'Lorem ipsum dolor sit ametque?', 1),
  (3, 'Note 3', 'Lorem ipsum dolor sit ametque?', 2), 
  (4, 'Note 4', 'Lorem ipsum dolor sit ametque?', 2),  
  (5, 'Note 5', 'Lorem ipsum dolor sit ametque?', 1), 
  (6, 'Note 6', 'Lorem ipsum dolor sit ametque?', 3), 
  (7, 'Note 7', 'Lorem ipsum dolor sit ametque?', 3);

  