module.exports = function (sequelizer, dataTypes) {
  return sequelizer.define('todo', {
    description: {
      type: dataTypes.STRING,
      allowNull: false,
      vadilate: {
        len: [1, 250]
      }
    },
    completed: {
      type: dataTypes.INTEGER,
      allowNull: false,
      defaultValue: false
    }
  });
};
