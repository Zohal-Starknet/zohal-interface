import React, { useState } from 'react';
import PoolCard from './poolCard';
import './marketScreen.css';

const MarketCreate: React.FC = () => {
    const [poolAddress, setPoolAddress] = useState('');
    const [poolAddresses, setPoolAddresses] = useState<string[]>([]);

    const handleAddPool = (e: React.FormEvent) => {
        e.preventDefault();
        if (poolAddress) {
            setPoolAddresses([...poolAddresses, poolAddress]);
            setPoolAddress(''); 
        }
    };

    const handleAddLiquidity = (address: string) => {
        console.log(`Adding liquidity to ${address}`);
    };

    const handleRemoveLiquidity = (address: string) => {
        console.log(`Removing liquidity from ${address}`);
    };

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">Pool Management</h1>
            </div>
            <form className="input-form" onSubmit={handleAddPool}>
                <div className="input-group">
                    <label>Pool Address</label>
                    <input
                        className="input-field"
                        placeholder="Enter Pool Address"
                        value={poolAddress}
                        onChange={(e) => setPoolAddress(e.target.value)}
                    />
                </div>
                <button className="add-pool-button" type="submit">
                    Add Pool
                </button>
            </form>
            <div className="pool-list">
                {poolAddresses.map((address, index) => (
                    <PoolCard
                        key={index}
                        poolAddress={address}
                        onAddLiquidity={handleAddLiquidity}
                        onRemoveLiquidity={handleRemoveLiquidity}
                    />
                ))}
            </div>
        </div>
    );
};

export default MarketCreate;
