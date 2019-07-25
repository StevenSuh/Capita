export const isNewInstitutionId = (accounts, index) => {
  if (index < 1) {
    return true;
  }

  return (
    accounts[index].institutionLinkId !== accounts[index - 1].institutionLinkId
  );
};
