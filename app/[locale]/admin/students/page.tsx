import { StudentsTable } from "@/components/admin/students/StudentsTable";
import { getStudents } from "@/server-actions/students/get-students";

const StudentsPage = async () => {
  const result = await getStudents();
  const students = result.success ? result.data ?? [] : [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Student List</h2>
        <p className="text-muted-foreground">
          Manage your students and their information.
        </p>
      </div>
      <StudentsTable data={students} />
    </div>
  );
};

export default StudentsPage;
