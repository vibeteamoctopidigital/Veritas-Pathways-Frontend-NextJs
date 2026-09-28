// Each programme is judged on different results: the Foundation Year on IFY
// points and grades, Year One/Two on credits and an average score, Masters
// Preparation on a Research Methods grade, Art & Design on its modules. This
// picks whichever the course actually has, so a card never shows an empty
// "IFY Points" tile for a course that does not use IFY points.
export const primaryRequirement = (course) => {
    if (course.ifyPointsRequired != null) {
        return { label: 'IFY Points', value: course.ifyPointsRequired, detail: course.ifyGradesRequired };
    }
    if (course.ifyGradesRequired) {
        return { label: 'IFY Grades', value: course.ifyGradesRequired };
    }
    if (course.creditsRequired != null) {
        return {
            label: 'Credits',
            value: course.creditsRequired,
            detail: course.averageScoreRequired != null ? `avg ${course.averageScoreRequired}` : null,
        };
    }
    if (course.averageScoreRequired != null) {
        return { label: 'Average Score', value: course.averageScoreRequired };
    }
    if (course.researchMethodsGrade) {
        return { label: 'Research Methods', value: course.researchMethodsGrade };
    }
    if (course.modules?.length) {
        return { label: 'Modules', value: course.modules[0] };
    }
    return { label: 'Requirements', value: 'See notes' };
};

// Every academic requirement the course has, for the details modal.
export const academicRequirements = (course) =>
    [
        course.ifyPointsRequired != null && { label: 'IFY Points', value: course.ifyPointsRequired },
        course.ifyGradesRequired && { label: 'IFY Grades', value: course.ifyGradesRequired },
        course.creditsRequired != null && { label: 'Credits Required', value: course.creditsRequired },
        course.averageScoreRequired != null && { label: 'Average Score', value: course.averageScoreRequired },
        course.researchMethodsGrade && { label: 'Research Methods', value: course.researchMethodsGrade },
        ...(course.modules || []).map((module, i) => ({ label: `Module ${i + 1}`, value: module })),
    ].filter(Boolean);
