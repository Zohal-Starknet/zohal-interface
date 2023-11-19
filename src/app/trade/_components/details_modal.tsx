import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { type Dispatch, Fragment, type SetStateAction } from 'react'

export default function DetailsModal({
    collateral,
    entryPrice,
    isLongPosition,
    leverage,
    liquidationPrice,
    markPrice,
    netValue,
    open,
    position,
    positionType,
    setOpen,
    size,
    token,
}: {
    collateral: { dollar: string; token: string }
    entryPrice: string
    isLongPosition: boolean
    leverage: string
    liquidationPrice: string
    markPrice: string
    netValue: { price: string; purcentage: string }
    open: boolean
    position: string
    positionType: string
    setOpen: Dispatch<SetStateAction<boolean>>
    size: string
    token: {
        address: string
        decimals: number
        icon: string
        name: string
    }
}) {
    const closeModal = () => {
        setOpen(false)
    }
    return (
        <Transition.Root as={Fragment} show={open}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end lg:items-center justify-center text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative w-full transform overflow-hidden rounded-t-2xl bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:p-6 lg:max-w-sm space-y-5">
                                <div className='w-full flex justify-between items-center'>
                                    <span>{token.name}</span>
                                    <button onClick={closeModal}><XMarkIcon className='h-6 text-white' /></button>
                                </div>
                                <div className='space-y-2.5'>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Position</span>
                                        <span>{position}</span>
                                    </div>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Position Type</span>
                                        <span>{positionType}</span>
                                    </div>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Entry price</span>
                                        <span>{entryPrice}</span>
                                    </div>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Net Value</span>
                                        <span>
                                            <span>{netValue.price}</span>  <span
                                                className={clsx(
                                                    "text-sm",
                                                    isLongPosition ? "text-[#40B68B]" : "text-[#FF5354]",
                                                )}>{netValue.purcentage}</span>
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Size</span>
                                        <span>{size}</span>
                                    </div>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Collateral</span>
                                        <span>
                                            <span>{collateral.dollar}</span> <span>({collateral.token})</span>
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Leverage</span>
                                        <span>{leverage}</span>
                                    </div>

                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Liquidation Price</span>
                                        <span>{liquidationPrice}</span>
                                    </div>
                                    <div className='w-full flex justify-between items-center text-xs'>
                                        <span>Market Price</span>
                                        <span>{markPrice}</span>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
