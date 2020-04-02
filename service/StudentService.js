class StudentService {
    
    constructor(Student, SchemaValidation, StudentValidation, GPError) {
        this.Student = Student;
        this.SchemaValidation = SchemaValidation;
        this.StudentValidation = StudentValidation;
        this.GPError = GPError;
    }

    /**
     * 
     * @param {Object} studentDTO student data transfere object
     * @param {String} videoLink the user's face video
     */
    async addStudent(studentDTO, videoLink) {
        await this.SchemaValidation.validateNewStudent(studentDTO);
        await this.StudentValidation.validateStudentDoesntExist(studentDTO.email);

        const student = await new this.Student({
            ...studentDTO,
            videoLink
        }).save();

        return student;
    }

}

module.exports = StudentService;