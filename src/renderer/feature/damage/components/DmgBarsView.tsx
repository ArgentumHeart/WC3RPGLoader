import { FC, useMemo } from "react";
import Box from "@mui/material/Box/Box"
import { IDamagePerPlayer } from "../../../../types";
import classColors from "../colors/classColors";
import { FALLBACK_COLOR } from "../colors/fallback";
import { slotColors } from "../colors/playerSlot";

interface Props {
    damageReport?: IDamagePerPlayer;
    colorScheme: 'slot' | 'class';
}

export const DamageBarsView: FC<Props> = (props) => {
    const { damageReport, colorScheme = 'slot' } = props;

    if (!damageReport || damageReport.players.length === 0) return null;
    return (
        <Box sx={{ marginTop: '10px' }}>
            {damageReport.players.map((el, index) => (
                <DmgBar
                    key={`${damageReport.damageType}_${el.playerName}`}
                    className={el.className}
                    percentage={el.damagePercentage}
                    max={damageReport.players[0].damagePercentage}
                    player={el.playerName}
                    slot={el.slotNumber || 1}
                    index={index}
                    colorScheme={colorScheme}
                />
            ))}
        </Box>
    )
}

interface IDmgBarProps {
    className: string;
    percentage: number;
    max: number;
    player: string;
    slot: number;
    index: number;
    colorScheme: string;
}

export const DmgBar: FC<IDmgBarProps> = ({ className, percentage, player, index, colorScheme, max, slot }) => {
    const color = useMemo(() => {
        let res = FALLBACK_COLOR
        switch(colorScheme) {
            case 'slot':
                res = slotColors[slot] || res;
                break;
            case 'class':
                res = classColors[className] || res;
                break;
        }

        return res
    }, [colorScheme])

    return (
        <Box sx={{ position: 'relative', height: '30px' }}>
            <div style={{ position: 'absolute', top: 4, left: 10}}>{index + 1}.&nbsp;{player}&nbsp;[{className}]</div>
            <div style={{ position: 'absolute', top: 4, right: 5 }}>{percentage}%</div>
            <Box sx={{ 
                height: '100%',
                width: `${percentage / max * 100}%`,
                borderRadius: '2px',
                background: 
                     'linear-gradient(180deg, rgba(180,180,180,0.15) 0%, rgba(0,0,0,0.0) 10%, rgba(0,0,0,0.0) 90%, rgba(180,180,180,0.15) 100%),' +
                    `linear-gradient(to right, ${color}C8 0%, ${color}B4 50%, ${color}20 100%)`,
                          
                }}/>
            </Box>
    )

}