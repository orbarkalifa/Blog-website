exports.getDate = () => {
    
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };

    let date = new Date();

    return date.toLocaleDateString("en-US", options);
};

