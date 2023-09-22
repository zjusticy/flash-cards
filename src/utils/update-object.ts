const updateObject = (oldObject: any, updatedProperties: any) => ({
  ...oldObject,
  ...updatedProperties,
});

export default updateObject;
