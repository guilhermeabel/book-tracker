"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Create a simple event system for avatar updates
export const avatarUpdateEvent = new EventTarget()
export const AVATAR_UPDATED = 'avatar_updated'

export function UserSettings() {
	const supabase = createClientComponentClient()
	const router = useRouter()
	const [user, setUser] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [uploading, setUploading] = useState(false)
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
	const [userName, setUserName] = useState<string | null>(null)

	useEffect(() => {
		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if (user) {
				setUser(user)

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
			setLoading(false)
		}

		getUser()
	}, [supabase])

	const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			setUploading(true)

			if (!event.target.files || event.target.files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = event.target.files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${user.id}-${Math.random()}.${fileExt}`

			// Upload the file to Supabase storage
			const { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(filePath, file)

			if (uploadError) {
				throw uploadError
			}

			// Get the public URL
			const { data: { publicUrl } } = supabase.storage
				.from('avatars')
				.getPublicUrl(filePath)

			// Update the user's profile with the avatar URL
			const { error: updateError } = await supabase
				.from('profiles')
				.update({ avatar_url: publicUrl })
				.eq('id', user.id)

			if (updateError) {
				throw updateError
			}

			setAvatarUrl(publicUrl)

			// Dispatch event to notify components about avatar update
			avatarUpdateEvent.dispatchEvent(new CustomEvent(AVATAR_UPDATED, { detail: publicUrl }))

			// Show success toast
			toast.success('Avatar updated successfully')

			router.refresh() // Refresh the page to show the new avatar
		} catch (error) {
			console.error('Error uploading avatar:', error)
			toast.error('Failed to update avatar')
		} finally {
			setUploading(false)
		}
	}

	if (loading) {
		return <div className="text-center p-4">Loading...</div>
	}

	return (
		<div className="space-y-6 max-w-md mx-auto">
			<div className="space-y-2">
				<h2 className="text-xl font-semibold tracking-tight">Profile Settings</h2>
				<p className="text-sm text-muted-foreground">
					Update your profile picture and manage your account.
				</p>
			</div>

			<div className="space-y-6">
				<div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg bg-muted/20">
					<Avatar className="h-24 w-24 border-2 border-background shadow-md">
						<AvatarImage
							src={avatarUrl || ''}
							alt={userName || 'User'}
						/>
						<AvatarFallback className="text-lg bg-primary/10">
							{userName?.charAt(0) || <User className="h-12 w-12" />}
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col gap-2 items-center">
						<Label
							htmlFor="avatar"
							className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
						>
							<Upload className="h-4 w-4" />
							{uploading ? 'Uploading...' : 'Upload Avatar'}
						</Label>
						<Input
							id="avatar"
							type="file"
							accept="image/*"
							className="hidden"
							disabled={uploading}
							onChange={uploadAvatar}
						/>
						<p className="text-xs text-muted-foreground">
							Click to upload a profile picture (JPEG, PNG)
						</p>
					</div>
				</div>
			</div>
		</div>
	)
} 
