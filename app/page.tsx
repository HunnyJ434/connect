'use client';

import Link from 'next/link';

const Home = () => {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Welcome to the Connect</h1>

      <p className="text-xl mb-4">
        This platform allows you to chat with others in real-time, either anonymously or as a registered user.
      </p>

      <p className="mb-4">
        You can either sign up to create a personalized experience or join the chat anonymously without any login required.
      </p>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Features:</h2>
        <ul className="list-disc pl-5">
          <li>Chat with other users in real-time.</li>
          <li>Anonymous chat for those who prefer not to sign in.</li>
          <li>Create an account to save your messages and have a personalized experience.</li>
          <li>Easy-to-use interface for seamless communication.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Get Started:</h2>
        <p className="mb-4">Choose how you'd like to communicate:</p>

        <div className="space-x-4">
          <Link href="/anonychat">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Start Anonymous Chat
            </button>
          </Link>

          <Link href="/signup">
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              Sign In / Sign Up
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3">About Us:</h2>
        <p className="mb-4">
          We built this platform to make it easy for people to connect with others. Whether you're here to make new friends, have casual conversations, or just pass the time, we've got you covered.
        </p>
        <p>Start chatting now and enjoy the experience!</p>
      </div>
    </div>
  );
};

export default Home;
