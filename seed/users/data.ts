import type { UserRole } from "../../src/schemas/users";

interface MockUser {
  username: string;
  email: string;
  role?: UserRole;
}

const mockUsers: MockUser[] = [
  // =======================================
  // ADMIN
  // =======================================

  {
    username: "admin_dojo",
    email: "admin@dojo.com",
    role: "admin",
  },

  // =======================================
  // CUSTOMER
  // =======================================

  {
    username: "john_doe",
    email: "john.doe@example.com",
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
  },
  {
    username: "mike_wilson",
    email: "mike.wilson@example.com",
  },
  {
    username: "sarah_jones",
    email: "sarah.jones@example.com",
  },
  {
    username: "david_brown",
    email: "david.brown@example.com",
  },
  {
    username: "emily_davis",
    email: "emily.davis@example.com",
  },
  {
    username: "alex_martin",
    email: "alex.martin@example.com",
  },
  {
    username: "olivia_taylor",
    email: "olivia.taylor@example.com",
  },
  {
    username: "chris_anderson",
    email: "chris.anderson@example.com",
  },
  {
    username: "sophia_thomas",
    email: "sophia.thomas@example.com",
  },
];

export default mockUsers;
