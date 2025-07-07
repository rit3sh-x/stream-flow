import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { Loader } from '@/components/loader'
import {
    Bot,
    Pencil,
    StarsIcon,
    Sparkles,
    Lock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAiTools } from '@/hooks/use-ai-tools'
import { Badge } from '@/components/ui/badge'

type Props = {
    trial: boolean
    videoId: string
}

export const AiTools = ({ trial, videoId }: Props) => {
    const router = useRouter()
    const {
        generateSummary,
        isGenerating,
        canUseAi,
        trialUsed
    } = useAiTools(videoId, trial)

    const handleTryNow = () => {
        if (canUseAi) {
            generateSummary()
        }
    }

    const handleUpgrade = () => {
        router.push("/pricing")
    }

    return (
        <TabsContent value="AI tools">
            <div className="p-5 bg-ring/20 rounded-xl flex flex-col gap-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-3xl text-foreground font-bold">AI Tools</h2>
                            {!trialUsed && (
                                <Badge variant="outline" className="border-green-500 text-green-600">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Trial Available
                                </Badge>
                            )}
                            {trialUsed && (
                                <Badge variant="outline" className="border-orange-500 text-orange-600">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Trial Used
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground text-base">
                            {trialUsed
                                ? 'You\'ve used your free trial. Upgrade to PRO for unlimited AI features!'
                                : 'Try our AI tools for free! Generate descriptions, summaries, and more.'
                            }
                        </p>
                    </div>

                    <div className="flex gap-4 w-full justify-end">
                        {canUseAi && (
                            <Button
                                className="mt-2 text-sm bg-[#a22fe0] hover:bg-[#8a25c0]"
                                onClick={handleTryNow}
                                disabled={isGenerating}
                            >
                                <Loader state={isGenerating}>
                                    Try Now (Free)
                                </Loader>
                            </Button>
                        )}

                        <Button
                            className="mt-2 text-sm bg-background"
                            variant={'secondary'}
                            onClick={handleUpgrade}
                        >
                            <Loader state={false}>
                                {trialUsed ? 'Upgrade to PRO' : 'Upgrade Now'}
                            </Loader>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl p-4 gap-4 flex flex-col border border-foreground/30">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-[#a22fe0]">Flow AI</h2>
                        <StarsIcon
                            color="#a22fe0"
                            fill="#a22fe0"
                        />
                    </div>

                    <div className="flex gap-2 items-center justify-start">
                        <div className="p-3 rounded-full bg-foreground/90">
                            <Pencil color="#a22fe0" className='size-6' />
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-md font-medium">AI Summary Generation</h3>
                                {!trialUsed && (
                                    <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                                        1 Free Try
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Generate compelling titles and descriptions for your videos using AI.
                                {trialUsed && (
                                    <span className="text-orange-500 ml-1">
                                        (Trial used - Upgrade for more)
                                    </span>
                                )}
                            </p>
                        </div>
                        {!canUseAi && (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                    </div>

                    <div className="flex gap-2 items-center justify-start opacity-60">
                        <div className="p-3 rounded-full bg-foreground/90">
                            <Bot color="#a22fe0" className='size-6' />
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-md font-medium">AI Chat Agent</h3>
                                <Badge variant="outline" className="text-xs">
                                    Coming Soon
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Viewers can ask questions about your video and get AI-powered responses.
                            </p>
                        </div>
                        <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </TabsContent>
    )
}