export const dropHeaderLine = (change: string): string => {
    let changesArray = change.split('\n');
    changesArray = changesArray.slice(1);
    return changesArray.join('%NEW_LINE%');
};
