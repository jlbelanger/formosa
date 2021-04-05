export default (oldDirty, name) => {
	const newDirty = [...oldDirty];
	if (!newDirty.includes(name)) {
		newDirty.push(name);
	}
	return newDirty;
};
