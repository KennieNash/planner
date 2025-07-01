
export const useProviderData = () => {
  // Sample data
  const providerStats = {
    totalEarnings: 15420,
    activeRequests: 8,
    completedJobs: 127,
    averageRating: 4.8,
    responseTime: '2h 15min',
    completionRate: 95
  };

  // Financial data
  const earningsData = {
    totalEarnings: 15420,
    monthlyEarnings: 3250,
    pendingPayouts: 850,
    lastPayout: 'Jan 12, 2024',
    nextPayout: 'Jan 19, 2024',
    payoutFrequency: 'weekly' as const
  };

  const paymentsData = [
    {
      id: '1',
      customerName: 'John Smith',
      serviceType: 'Emergency Plumbing',
      amount: 280,
      status: 'completed' as const,
      date: 'Jan 15, 2024',
      paymentMethod: 'Credit Card',
      invoiceId: 'INV-001'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      serviceType: 'Drain Cleaning',
      amount: 150,
      status: 'pending' as const,
      date: 'Jan 14, 2024',
      paymentMethod: 'Bank Transfer',
      invoiceId: 'INV-002'
    },
    {
      id: '3',
      customerName: 'Mike Wilson',
      serviceType: 'Bathroom Renovation',
      amount: 2500,
      status: 'completed' as const,
      date: 'Jan 10, 2024',
      paymentMethod: 'Check',
      invoiceId: 'INV-003'
    }
  ];

  const payoutMethods = [
    {
      id: '1',
      type: 'bank' as const,
      last4: '4567',
      isDefault: true,
      bankName: 'Chase Bank'
    },
    {
      id: '2',
      type: 'card' as const,
      last4: '1234',
      isDefault: false,
      cardBrand: 'Visa'
    }
  ];

  const analyticsData = {
    monthlyRevenue: [
      { month: 'Jul', revenue: 2800, jobs: 12 },
      { month: 'Aug', revenue: 3200, jobs: 15 },
      { month: 'Sep', revenue: 2950, jobs: 13 },
      { month: 'Oct', revenue: 3800, jobs: 18 },
      { month: 'Nov', revenue: 3400, jobs: 16 },
      { month: 'Dec', revenue: 4200, jobs: 20 },
      { month: 'Jan', revenue: 3250, jobs: 14 }
    ],
    serviceBreakdown: [
      { service: 'Plumbing', revenue: 8500, count: 45 },
      { service: 'Renovation', revenue: 4200, count: 8 },
      { service: 'Repair', revenue: 2720, count: 32 }
    ],
    totalJobs: 127,
    averageJobValue: 285,
    customerRetention: 68,
    topMonth: 'December'
  };

  const recentActivities = [
    {
      id: 1,
      type: 'payment' as const,
      title: 'Payment Received',
      description: 'Emergency plumbing repair - John Doe',
      timestamp: '2024-01-15T10:30:00Z',
      amount: 280
    },
    {
      id: 2,
      type: 'review' as const,
      title: 'New Review',
      description: 'Excellent work on kitchen sink repair',
      timestamp: '2024-01-15T09:15:00Z',
      rating: 5
    },
    {
      id: 3,
      type: 'message' as const,
      title: 'New Message',
      description: 'Sarah Wilson: When can you start the bathroom renovation?',
      timestamp: '2024-01-15T08:45:00Z'
    },
    {
      id: 4,
      type: 'request' as const,
      title: 'New Service Request',
      description: 'Urgent drain cleaning needed - Downtown area',
      timestamp: '2024-01-15T07:20:00Z'
    }
  ];

  const providerServices = [
    {
      id: 1,
      name: 'Emergency Plumbing Repair',
      category: 'Plumbing',
      price: '$80-150/hour',
      isActive: true,
      requestsCount: 23,
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      name: 'Drain Cleaning',
      category: 'Plumbing',
      price: '$120-200',
      isActive: true,
      requestsCount: 15,
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      name: 'Bathroom Renovation',
      category: 'Renovation',
      price: '$2000-5000',
      isActive: false,
      requestsCount: 5,
      lastUpdated: '2 weeks ago'
    }
  ];

  const quoteRequests = [
    {
      id: 1,
      serviceTitle: 'Emergency Plumbing Repair',
      customerName: 'John Smith',
      customerLocation: 'Downtown Seattle',
      description: 'Burst pipe in basement causing flooding. Need immediate repair.',
      urgency: 'high' as const,
      preferredDate: '2024-01-16',
      budget: '$200-400',
      submittedAt: '2024-01-15T08:30:00Z',
      status: 'pending' as const,
      contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'john.smith@email.com'
      }
    },
    {
      id: 2,
      serviceTitle: 'Drain Cleaning',
      customerName: 'Sarah Johnson',
      customerLocation: 'Capitol Hill',
      description: 'Kitchen sink draining very slowly, probably clogged.',
      urgency: 'medium' as const,
      preferredDate: '2024-01-18',
      budget: '$100-200',
      submittedAt: '2024-01-15T06:15:00Z',
      status: 'pending' as const,
      contactInfo: {
        email: 'sarah.j@email.com'
      }
    },
    {
      id: 3,
      serviceTitle: 'Bathroom Renovation',
      customerName: 'Mike Wilson',
      customerLocation: 'Ballard',
      description: 'Complete bathroom remodel including new tiles, fixtures, and plumbing.',
      urgency: 'low' as const,
      preferredDate: '2024-02-01',
      budget: '$3000-5000',
      submittedAt: '2024-01-14T14:20:00Z',
      status: 'responded' as const,
      contactInfo: {
        phone: '+1 (555) 987-6543',
        email: 'mike.wilson@email.com'
      }
    }
  ];

  return {
    providerStats,
    earningsData,
    paymentsData,
    payoutMethods,
    analyticsData,
    recentActivities,
    providerServices,
    quoteRequests
  };
};
