export const getEntityId = (entityOrId) => {
  const rawId =
    entityOrId && typeof entityOrId === "object" && "_id" in entityOrId
      ? entityOrId._id
      : entityOrId;

  if (typeof rawId === "string" || typeof rawId === "number") {
    return String(rawId);
  }

  if (
    rawId &&
    typeof rawId === "object" &&
    typeof rawId.$oid === "string"
  ) {
    return rawId.$oid;
  }

  return "";
};

export const hasSameEntityId = (left, right) => {
  const leftId = getEntityId(left);
  return leftId !== "" && leftId === getEntityId(right);
};
