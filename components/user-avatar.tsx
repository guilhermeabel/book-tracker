"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { AVATAR_UPDATED, UserSettings, avatarUpdateEvent } from "@/components/user-settings"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { User } from "lucide-react"
import { useEffect, useState } from "react"

export function UserAvatar() {
	const supabase = createClientComponentClient()
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
	const [userName, setUserName] = useState<string | null>(null)
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [loading, setLoading] = useState(true)

	const fetchUserProfile = async () => {
		try {
			setLoading(true)
			const { data: { user } } = await supabase.auth.getUser()

			if (user) {
				// Fetch profile data
				const { data: profile } = await supabase
					.from('profiles')
					.select('avatar_url, name')
					.eq('id', user.id)
					.single()

				if (profile) {
					setAvatarUrl(profile.avatar_url)
					setUserName(profile.name)
				}
			}
		} catch (error) {
			console.error('Error fetching user profile:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUserProfile()

		// Listen for avatar update events
		const handleAvatarUpdate = (event: Event) => {
			const customEvent = event as CustomEvent<string>
			setAvatarUrl(customEvent.detail)
		}

		avatarUpdateEvent.addEventListener(AVATAR_UPDATED, handleAvatarUpdate)

		return () => {
			avatarUpdateEvent.removeEventListener(AVATAR_UPDATED, handleAvatarUpdate)
		}
	}, [supabase])

	const openSettings = () => {
		setIsDrawerOpen(true)
	}

	if (loading) {
		return (
			<Avatar className="h-10 w-10 cursor-pointer border shadow-sm">
				<AvatarFallback>
					<User className="h-5 w-5" />
				</AvatarFallback>
			</Avatar>
		)
	}

	return (
		<>
			<Avatar
				className="h-10 w-10 cursor-pointer border hover:ring-2 hover:ring-primary/20 hover:shadow-md transition-all duration-200 shadow-sm"
				onClick={openSettings}
			>
				<AvatarImage
					src={avatarUrl || ''}
					alt={userName || 'User'}
				/>
				<AvatarFallback className="bg-primary/5">
					{userName?.charAt(0) || <User className="h-5 w-5" />}
				</AvatarFallback>
			</Avatar>

			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerContent className="sm:max-w-md mx-auto rounded-t-lg overflow-hidden">
					<div className="max-h-[85vh] overflow-y-auto">
						<DrawerHeader className="border-b sticky top-0 bg-background z-10">
							<DrawerTitle>Account Settings</DrawerTitle>
						</DrawerHeader>
						<div className="px-4 py-6">
							<UserSettings />
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	)
}
