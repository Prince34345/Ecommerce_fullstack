"use client";

import { GraphData } from '@/actions/get-graphRevenue';
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from 'recharts'

interface OverviewProps {
    data: GraphData[]
}

export const Overview: React.FC<OverviewProps> = ({
    data
}) => {
  return (
    <ResponsiveContainer width={'100%'} height={350}>
        <BarChart data={data}>
           <XAxis dataKey={"name"} stroke='#888888' fontSize={12} tickLine={false} axisLine={false}/>
           <YAxis tickFormatter={(val) => `$${val}`} stroke='#888888' fontSize={12} tickLine={false} axisLine={false}/>
           <Bar dataKey="total" fill='#3498db' radius={[4,4,0,0]}/>
        </BarChart>
    </ResponsiveContainer>
  )
}
