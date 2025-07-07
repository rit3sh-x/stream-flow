import { useState } from 'react'
import { useMutationData } from './use-mutation-data'
import { useQueryData } from './use-query-data'
import { generateVideoSummary, checkAiUsage } from '@/actions/ai'

type UsageData = {
    canUse: boolean
    hasUsedTrial: boolean
}

export const useAiTools = (videoId: string, trial: boolean) => {
    const [isGenerating, setIsGenerating] = useState(false)

    const { data: usageData } = useQueryData(
        ['ai-usage'],
        async () => {
            const data = await checkAiUsage()
            return data;
        }
    )

    const { mutate: generateSummary, isPending: isSummaryPending } = useMutationData(
        ['generate-summary'],
        async () => {
            setIsGenerating(true)
            const result = await generateVideoSummary(videoId)
            setIsGenerating(false)
            return result
        },
        ['preview-video', 'user-videos', 'ai-usage'],
        () => {
            setIsGenerating(false)
        }
    )

    const actualTrialUsed = (usageData as UsageData)?.hasUsedTrial ?? trial
    const canUseAi = !actualTrialUsed

    const handleGenerateSummary = () => {
        if (canUseAi) {
            generateSummary(videoId)
        }
    }

    return {
        generateSummary: handleGenerateSummary,
        isGenerating: isGenerating || isSummaryPending,
        canUseAi,
        trialUsed: actualTrialUsed
    }
}