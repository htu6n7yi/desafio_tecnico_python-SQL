
        <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">🃏 Cards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card Estatística */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total de Produtos</p>
                            <p className="text-3xl font-bold text-gray-900">247</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600 font-medium">↑ 12%</span>
                        <span className="text-gray-500 ml-2">vs. mês passado</span>
                    </div>
                </div>

                {/* Card com Badge */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">Notebook Dell</h3>
                            <p className="text-sm text-gray-500">Eletrônicos</p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            Em estoque
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Preço:</span>
                            <span className="font-semibold">R$ 3.500,00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estoque:</span>
                            <span className="font-semibold">15 unidades</span>
                        </div>
                    </div>
                </div>

                {/* Card de Alerta */}
                <div className="bg-orange-50 rounded-lg border-2 border-orange-200 p-6">
                    <div className="flex items-start">
                        <div className="bg-orange-100 p-2 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-orange-900 mb-1">Estoque Baixo</h4>
                            <p className="text-sm text-orange-700">5 produtos com menos de 3 unidades</p>
                            <button className="text-orange-600 text-sm font-medium mt-2 hover:underline">
                                Ver produtos →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>