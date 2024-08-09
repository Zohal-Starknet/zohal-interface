import React from 'react';

interface PoolCardProps {
    poolAddress: string;
    onAddLiquidity: (poolAddress: string) => void;
    onRemoveLiquidity: (poolAddress: string) => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ poolAddress, onAddLiquidity, onRemoveLiquidity }) => {
    return (
        <div className="pool-card">
            <h3>Pool Address</h3>
            <p>{poolAddress}</p>
            <div className="button-group">
                <button onClick={() => onAddLiquidity(poolAddress)}>Add Liquidity</button>
                <button onClick={() => onRemoveLiquidity(poolAddress)}>Remove Liquidity</button>
            </div>
        </div>
    );
};

export default PoolCard;
