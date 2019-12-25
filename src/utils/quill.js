export const generateTaskNotes = function(integration, link) {
  return JSON.stringify({
    ops: [
      { insert: `Added from ${integration}: ` },
      { attributes: { link }, insert: link },
      { insert: '\n' },
    ],
  });
};
