// types/index.ts
export type User = {
    id: string;  // Ensure this is not optional if NextAuth.js expects it
    email: string;
    name?: string;
};
interface Message {
    text: string;
}

  
  
