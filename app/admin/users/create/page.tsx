import UserForm from "@/components/admin/UserForm";

export default function CreateUserPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Create New User</h1>
        <p className="mt-2 text-gray-600">Add a new admin user to the system</p>
      </div>
      <UserForm />
    </div>
  );
}
