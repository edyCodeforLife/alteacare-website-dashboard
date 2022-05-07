const sortFamilyMembers = (familyMembers = []) => {
  // Find `Pribadi` from the list
  const personal = familyMembers.find(
    familyMember => familyMember?.family_relation_type?.name === 'Pribadi'
  );

  // Exclude `Pribadi` from the list
  const tempFamilyMembers = familyMembers.filter(
    familyMember => familyMember?.family_relation_type?.name !== 'Pribadi'
  );

  // If `Pribadi` is found, set it as the first element of the list
  // otherwise use the default sorting
  const sortedFamilyMembers = [personal, ...tempFamilyMembers];
  return personal ? sortedFamilyMembers : familyMembers;
};

export default sortFamilyMembers;
