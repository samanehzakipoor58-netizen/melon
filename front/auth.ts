import { Role } from './../back/generated/prisma/index.d';
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [Google, GitHub],
  callbacks: {

    async signIn({ user }) {
      try {
        await axios.post("http://localhost:3001/api/users", {
          name: user.name,
          email: user.email,
          image: user.image,
          
        });
      } catch (err) {
        console.error("Error saving user to DB:", err);
      }
      return true;
    },

async jwt({ token, user }) {
  if (user) {
    token.id = user.id || token.id;
    token.email = user.email || token.email;
    token.name = user.name || token.name;
    
  }
  return token;
},

async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.email = token.email as string;
    session.user.name = token.name as string;
    token.Role = token.role as Role
  }
  return session;
},



  },
});


