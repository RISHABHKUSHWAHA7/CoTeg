"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logout from "@/helpers/logoutHelp";
import { FaArrowLeft } from "react-icons/fa";
import StarsCanvas from "@/components/StarCanvas";
import Link from "next/link";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invites, setInvites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setEmail(currentUser.email);
      fetchInvites(currentUser.uid);
    } else {
      router.push("/login");
    }
  }, []);

  const fetchInvites = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setInvites(userSnap.data().invites || []);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return;
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to your email!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error sending password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvite = async (workspaceId) => {
    if (!user) return;

    try {
      const membersRef = doc(db, `workspaces/${workspaceId}/members`, user.uid);
      await setDoc(membersRef, {
        userId: user.uid,
        role: "contributor",
        displayName: user.displayName || "Unknown",
        photoURL: user.photoURL || "/robotic.png",
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        invites: arrayRemove(workspaceId),
      });

      setInvites(invites.filter((id) => id !== workspaceId));
      toast.success("You have joined the workspace!");
    } catch (error) {
      toast.error("Error accepting invite!");
    }
  };

  const handleDeleteInvite = async (workspaceId) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        invites: arrayRemove(workspaceId),
      });

      setInvites(invites.filter((id) => id !== workspaceId));
      toast.success("Invite deleted successfully.");
    } catch (error) {
      toast.error("Error deleting invite!");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <StarsCanvas className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-md bg-gray-950 rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-16 h-16 mb-4 border-2 border-blue-500">
            <AvatarImage
              src={auth.currentUser?.photoURL || "/robotic.png"}
              alt="Profile"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold text-blue-400">
            {user?.displayName || "User"}
          </h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        <Button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-sm font-medium py-2 rounded-md mb-4"
        >
          Logout
        </Button>

        <Link href="/dashboard" passHref>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-medium py-2 rounded-md mb-4 flex items-center justify-center">
            <FaArrowLeft className="mr-2" />
            Dashboard
          </Button>
        </Link>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-medium py-2 rounded-md mb-4">
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 p-6 rounded-lg">
            <DialogTitle className="text-lg font-semibold mb-4 text-white">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mb-4">
              Enter your email to receive a password reset link.
            </DialogDescription>
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 bg-gray-700 text-white border border-blue-500 rounded-md"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-sm font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordReset}
                disabled={isLoading}
                className={`${
                  isLoading ? "bg-gray-500" : "bg-blue-600"
                } hover:bg-blue-700 text-sm font-medium py-2 px-4 rounded-md`}
              >
                {isLoading ? "Sending..." : "Send Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Profile;