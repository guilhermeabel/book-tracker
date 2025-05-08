"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Brain, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {

	return (
		<div className="min-h-screen relative overflow-hidden bg-black">
			{/* Subtle animated gradient background */}
			<div
				className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black 
				opacity-80"
			/>

			{/* Animated wave effect similar to TanStack */}
			<div className="absolute inset-0 opacity-20 pointer-events-none z-10">
				<div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,0,0,0))]"></div>
				<div className="absolute w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(69,179,224,0.2),rgba(0,0,255,0))]"></div>
				<div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url%28%23noise%29%27/%3E%3C/svg%3E')]"></div>
			</div>

			<div className="relative z-20 container mx-auto px-4 py-20 min-h-screen flex flex-col">
				<header className="flex justify-between items-center mb-12">
					<div className="flex items-center">
						<h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
							StudyRats
						</h1>
					</div>
				</header>

				<div className="flex-1 flex flex-col md:flex-row items-center justify-center">
					<div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
						<h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
							Track, Compete, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">Excel</span>
						</h2>
						<p className="text-xl text-gray-300 mb-8">
							Log your study sessions, compete with friends, and watch yourself grow. StudyRats helps you build better study habits through social accountability.
						</p>
						<div className="space-x-4">
							<Button asChild size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 border-0">
								<Link href="/auth">Get Started</Link>
							</Button>
							<Button asChild size="lg" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
								<Link href="/auth">Log In</Link>
							</Button>
						</div>
					</div>

					<div className="md:w-1/2 grid grid-cols-2 gap-4 max-w-md mx-auto">
						<>
							<div className="col-span-2 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700 transform -rotate-1 animate-float">
								<TrendingUp className="h-8 w-8 text-indigo-400 mb-3" />
								<h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
								<p className="text-gray-300">See your study habits improve over time with detailed analytics</p>
							</div>

							<div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700 transform rotate-1 animate-float" style={{ animationDelay: "0.5s" }}>
								<Users className="h-8 w-8 text-purple-400 mb-3" />
								<h3 className="text-lg font-bold text-white mb-2">Study Groups</h3>
								<p className="text-gray-300">Create or join study groups with friends</p>
							</div>

							<div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700 transform -rotate-1 animate-float" style={{ animationDelay: "1s" }}>
								<BookOpen className="h-8 w-8 text-pink-400 mb-3" />
								<h3 className="text-lg font-bold text-white mb-2">Log Sessions</h3>
								<p className="text-gray-300">Record your study time and track subjects</p>
							</div>

							<div className="col-span-2 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700 transform rotate-1 animate-float" style={{ animationDelay: "1.5s" }}>
								<Brain className="h-8 w-8 text-indigo-400 mb-3" />
								<h3 className="text-xl font-bold text-white mb-2">Build Habits</h3>
								<p className="text-gray-300">Use streaks and competition to stay motivated and consistent</p>
							</div>
						</>
					</div>
				</div>

				<footer className="mt-auto pt-8 text-center text-gray-500">
					<p>© {new Date().getFullYear()} StudyRats. All rights reserved.</p>
				</footer>
			</div>
		</div>
	)
} 
