'use client'

import { Button } from "@/components/ui/button"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useState } from "react"

interface GroupInviteCodeProps {
	inviteCode: string
}

export default function GroupInviteCode({ inviteCode }: GroupInviteCodeProps) {
	const [copied, setCopied] = useState(false)

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(inviteCode)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="flex items-center space-x-2">
			<div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border font-mono text-lg font-bold tracking-wider flex-1">{inviteCode}</div>
			<Button size="icon" variant="outline" onClick={copyToClipboard}>
				{copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ClipboardIcon className="h-4 w-4" />}
			</Button>
		</div>
	)
} 
