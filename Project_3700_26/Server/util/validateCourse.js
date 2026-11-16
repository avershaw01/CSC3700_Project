// util/validateCourse.js
function validateCourse(body) {
    const { number, title, credits } = body;

    if (!number || !title) {
        return 'number and title are required';
    }
    if (credits === undefined || credits === null || isNaN(parseInt(credits))) {
        return 'credits must be a number';
    }
    return null;
}

module.exports = validateCourse;