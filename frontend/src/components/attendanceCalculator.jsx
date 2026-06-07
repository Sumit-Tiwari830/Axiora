export const calculateSubjectAttendancePercentage = (
    presentCount,
    totalSessions
) => {
    const present = Number(presentCount) || 0;
    const total = Number(totalSessions) || 0;

    if (total === 0) return 0;

    return Number(((present / total) * 100).toFixed(2));
};

export const groupAttendanceBySubject = (subjectAttendance = []) => {
    const attendanceBySubject = {};

    subjectAttendance.forEach((attendance) => {
        const subName = attendance?.subName?.subName;
        const sessions = attendance?.subName?.sessions || 0;
        const subId = attendance?.subName?._id;

        if (!subName) return;

        if (!attendanceBySubject[subName]) {
            attendanceBySubject[subName] = {
                present: 0,
                absent: 0,
                sessions,
                allData: [],
                subId,
            };
        }

        if (attendance.status === "Present") {
            attendanceBySubject[subName].present += 1;
        } else {
            attendanceBySubject[subName].absent += 1;
        }

        attendanceBySubject[subName].allData.push({
            date: attendance.date,
            status: attendance.status,
        });
    });

    return attendanceBySubject;
};

export const calculateOverallAttendancePercentage = (
    subjectAttendance = []
) => {
    let totalSessions = 0;
    let presentCount = 0;

    const subjects = new Set();

    subjectAttendance.forEach((attendance) => {
        const subId = attendance?.subName?._id;

        if (!subjects.has(subId)) {
            subjects.add(subId);
            totalSessions += Number(
                attendance?.subName?.sessions || 0
            );
        }

        if (attendance?.status === "Present") {
            presentCount += 1;
        }
    });

    if (totalSessions === 0) return 0;

    return Number(
        ((presentCount / totalSessions) * 100).toFixed(2)
    );
};