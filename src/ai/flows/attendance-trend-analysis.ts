'use server';

/**
 * @fileOverview Analyzes attendance patterns and membership data to provide proactive membership management recommendations.
 *
 * - analyzeAttendanceTrends - A function that triggers the analysis and returns recommendations.
 * - AttendanceTrendAnalysisInput - The input type for the analyzeAttendanceTrends function (currently empty).
 * - AttendanceTrendAnalysisOutput - The return type for the analyzeAttendanceTrends function, containing recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceTrendAnalysisInputSchema = z.object({});
export type AttendanceTrendAnalysisInput = z.infer<typeof AttendanceTrendAnalysisInputSchema>;

const AttendanceTrendAnalysisOutputSchema = z.object({
  recommendations: z.string().describe('Proactive membership management recommendations based on attendance trends and membership data.'),
});
export type AttendanceTrendAnalysisOutput = z.infer<typeof AttendanceTrendAnalysisOutputSchema>;

export async function analyzeAttendanceTrends(input: AttendanceTrendAnalysisInput): Promise<AttendanceTrendAnalysisOutput> {
  return analyzeAttendanceTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'attendanceTrendAnalysisPrompt',
  input: {schema: AttendanceTrendAnalysisInputSchema},
  output: {schema: AttendanceTrendAnalysisOutputSchema},
  prompt: `You are an expert in analyzing attendance data and membership trends for a skateboard play park.
  Based on the provided attendance patterns and membership data, provide proactive membership management recommendations to optimize park operations. Focus on suggesting strategies related to membership pricing, special promotions, or targeted communications. Keep the response concise and actionable.

  Analyze the data and provide actionable recommendations:
  - Identify peak and off-peak attendance times.
  - Determine which membership plans are most popular and which are underutilized.
  - Suggest strategies to increase attendance during off-peak hours.
  - Recommend membership plan adjustments to maximize revenue and customer satisfaction.
  `,
});

const analyzeAttendanceTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeAttendanceTrendsFlow',
    inputSchema: AttendanceTrendAnalysisInputSchema,
    outputSchema: AttendanceTrendAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
