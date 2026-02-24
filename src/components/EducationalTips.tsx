import React, { useState } from 'react';
import { Lightbulb, TrendingUp, Shield, Clock, PiggyBank, Briefcase, ChevronRight, ChevronDown } from 'lucide-react';

interface Tip {
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  action?: {
    type: 'focus-initial-investment';
  };
}

interface Props {
  onClose: () => void;
}

const tips: Tip[] = [
  {
    title: 'The Power of Compound Interest',
    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
    description: 'Understand how compound interest can exponentially grow your wealth over time.',
    details: [
      'Interest is earned on both your initial investment and previously earned interest',
      'The effect becomes more powerful over longer time periods',
      'Even small regular investments can grow significantly through compounding',
      'Starting early maximizes the benefit of compound interest'
    ],
    action: {
      type: 'focus-initial-investment'
    }
  },
  {
    title: 'Risk Management Strategies',
    icon: <Shield className="w-5 h-5 text-blue-500" />,
    description: 'Learn how to balance risk and reward in your investment portfolio.',
    details: [
      'Diversification helps reduce investment risk',
      'Higher returns typically come with higher risk',
      'Your risk tolerance should match your investment timeline',
      'Regular rebalancing helps maintain your desired risk level'
    ]
  },
  {
    title: 'Long-term Investment Planning',
    icon: <Clock className="w-5 h-5 text-purple-500" />,
    description: 'Develop strategies for achieving your long-term financial goals.',
    details: [
      'Set clear, measurable financial goals',
      'Consider inflation in your long-term planning',
      'Review and adjust your strategy periodically',
      'Account for major life changes in your plan'
    ]
  },
  {
    title: 'Smart Saving Habits',
    icon: <PiggyBank className="w-5 h-5 text-red-500" />,
    description: 'Develop effective saving habits to support your investment goals.',
    details: [
      'Automate your savings to maintain consistency',
      'Build an emergency fund before investing aggressively',
      'Take advantage of tax-advantaged accounts',
      'Live below your means to maximize savings'
    ]
  },
  {
    title: 'Investment Vehicles',
    icon: <Briefcase className="w-5 h-5 text-orange-500" />,
    description: 'Explore different investment options and their characteristics.',
    details: [
      'Stocks offer growth potential but higher volatility',
      'Bonds provide steady income with lower risk',
      'Real estate can offer both appreciation and income',
      'ETFs and mutual funds provide instant diversification'
    ]
  }
];

export default function EducationalTips({ onClose }: Props) {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const handleTipAction = (tip: Tip) => {
    if (tip.action?.type === 'focus-initial-investment') {
      const input = document.querySelector('input[placeholder="0"]') as HTMLInputElement;
      if (input) {
        onClose();
        setTimeout(() => {
          input.focus();
        }, 100);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">
        <Lightbulb className="w-6 h-6" />
        <h3>Investment Education Center</h3>
      </div>

      <div className="grid gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setExpandedTip(expandedTip === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                {tip.icon}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tip.description}
                  </p>
                </div>
              </div>
              {expandedTip === index ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedTip === index && (
              <div className="px-6 pb-4">
                <ul className="space-y-2 mb-4">
                  {tip.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-500 mt-1">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>

                {tip.action && (
                  <button
                    onClick={() => handleTipAction(tip)}
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Try it out →
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}