import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";

type StudyStats = {
  weekly: { name: string; hours: number }[]
  monthly: { name: string; hours: number }[]
  totalHours: number
  weeklyChange: number
  streak: number
  previousStreak: number
  streakIsAtRisk: boolean
  groupRank?: {
    rank: number
    groupName: string
  }
}

export function useStudyStats() {
  const supabase = createClientComponentClient()

  return useQuery({
    queryKey: ['study-stats'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get study logs for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: studyLogs, error } = await supabase
        .from('study_logs')
        .select('minutes, created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Process weekly data
      const weeklyData = Array(7).fill(0).map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
        return { name: dayName, hours: 0 }
      }).reverse()

      // Process monthly data (last 4 weeks)
      const monthlyData = Array(4).fill(0).map((_, i) => {
        const weekNumber = 4 - i
        return { name: `Week ${weekNumber}`, hours: 0 }
      })

      // Calculate hours for each period
      studyLogs.forEach(log => {
        const date = new Date(log.created_at)
        const hours = log.minutes / 60

        // Update weekly data
        const dayIndex = 6 - (new Date().getDay() - date.getDay() + 7) % 7
        if (dayIndex >= 0 && dayIndex < 7) {
          weeklyData[dayIndex].hours += hours
        }

        // Update monthly data
        const weekIndex = 3 - Math.floor((new Date().getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000))
        if (weekIndex >= 0 && weekIndex < 4) {
          monthlyData[weekIndex].hours += hours
        }
      })

      // Round hours to 1 decimal place
      weeklyData.forEach(day => day.hours = Math.round(day.hours * 10) / 10)
      monthlyData.forEach(week => week.hours = Math.round(week.hours * 10) / 10)

      // Calculate total hours
      const totalHours = studyLogs.reduce((sum, log) => sum + (log.minutes / 60), 0)

      // Calculate weekly change
      const currentWeekHours = weeklyData.reduce((sum, day) => sum + day.hours, 0)
      const lastWeekHours = monthlyData[2].hours // Week 3 in monthly data
      const weeklyChange = currentWeekHours - lastWeekHours

      // Calculate streak
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Check if user has studied today
      const hasStudiedToday = studyLogs.some(log => {
        const logDate = new Date(log.created_at)
        logDate.setHours(0, 0, 0, 0)
        return logDate.getTime() === today.getTime()
      })

      // Calculate current streak (including today if they've studied)
      let streak = 0
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        
        const hasStudyLog = studyLogs.some(log => {
          const logDate = new Date(log.created_at)
          logDate.setHours(0, 0, 0, 0)
          return logDate.getTime() === checkDate.getTime()
        })

        if (hasStudyLog) {
          streak++
        } else {
          break
        }
      }
      
      // Calculate previous streak (not including today)
      let previousStreak = 0
      if (!hasStudiedToday && streak === 0) {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        
        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(yesterday)
          checkDate.setDate(checkDate.getDate() - i)
          
          const hasStudyLog = studyLogs.some(log => {
            const logDate = new Date(log.created_at)
            logDate.setHours(0, 0, 0, 0)
            return logDate.getTime() === checkDate.getTime()
          })

          if (hasStudyLog) {
            previousStreak++
          } else {
            break
          }
        }
      }
      
      // Determine if streak is at risk (had a previous streak but hasn't studied today)
      const streakIsAtRisk = !hasStudiedToday && previousStreak > 0

      // Get group rank if user is in a group
      const { data: groupMembers } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .limit(1)

      let groupRank
      if (groupMembers && groupMembers.length > 0) {
        const { data: group } = await supabase
          .from('groups')
          .select('name')
          .eq('id', groupMembers[0].group_id)
          .single()

        if (group) {
          const { data: groupStudyLogs } = await supabase
            .from('study_logs')
            .select('user_id, minutes')
            .eq('group_id', groupMembers[0].group_id)

          if (groupStudyLogs) {
            const memberHours = groupStudyLogs.reduce((acc, log) => {
              acc[log.user_id] = (acc[log.user_id] || 0) + (log.minutes / 60)
              return acc
            }, {} as Record<string, number>)

            const sortedMembers = Object.entries(memberHours)
              .sort(([, a], [, b]) => b - a)
              .map(([id]) => id)

            const rank = sortedMembers.indexOf(user.id) + 1
            groupRank = { rank, groupName: group.name }
          }
        }
      }

      return {
        weekly: weeklyData,
        monthly: monthlyData,
        totalHours: Math.round(totalHours * 10) / 10,
        weeklyChange: Math.round(weeklyChange * 10) / 10,
        streak,
        previousStreak,
        streakIsAtRisk,
        groupRank
      } as StudyStats
    }
  })
} 
