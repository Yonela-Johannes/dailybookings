import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    const venue = await prisma.venue.findUnique({
      where: { slug },
      include: {
        category: true,
        business: {
          select: {
            verified: true
          }
        },
        address: true,
        contact: true,
        bookingConfig: true,
        serviceCategories: {
          include: {
            services: {
              where: {
                deletedAt: null
              }
            }
          }
        },
        employees: {
          where: {
            deletedAt: null
          },
          include: {
            services: true,
            schedules: true
          }
        },
        media: true,
        schedules: true,
        reviews: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                fullName: true,
                profile: {
                  select: {
                    avatarUrl: true
                  }
                }
              }
            },
            comments: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    profile: {
                      select: {
                        avatarUrl: true
                      }
                    }
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          }
        }
      }
    })

    if (!venue || venue.deletedAt) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Venue not found'
      })
    }

    // Map to Venue interface (DTO)
    return {
      id: venue.id,
      slug: venue.slug,
      name: venue.name,
      tagline: venue.tagline,
      description: venue.description || '',
      verified: venue.business?.verified || false,
      rating: venue.rating,
      reviewCount: venue.reviewCount,
      category: venue.category,
      tags: [], // Placeholder for future tagging system
      address: {
        street: venue.address?.street || '',
        suburb: venue.address?.suburb || '',
        city: venue.address?.city || '',
        region: venue.address?.region || '',
        postalCode: venue.address?.postalCode || '',
        lat: venue.address?.lat || 0,
        lng: venue.address?.lng || 0,
      },
      phone: venue.contact?.phone,
      media: venue.media.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString()
      })),
      serviceCategories: venue.serviceCategories.map(sc => ({
        id: sc.id,
        name: sc.name,
        services: sc.services.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          durationMinutes: s.durationMinutes,
          price: Number(s.price),
          priceIsFrom: s.priceIsFrom
        }))
      })),
      team: venue.employees.map(e => ({
        id: e.id,
        name: e.name,
        title: e.title,
        rating: e.rating,
        imageUrl: e.imageUrl
      })),
      reviews: venue.reviews.map(r => ({
        id: r.id,
        authorName: r.user.fullName || 'Anonymous',
        authorAvatarUrl: r.user.profile?.avatarUrl,
        rating: r.rating,
        body: r.body || '',
        serviceName: r.serviceName,
        employeeName: r.employeeName,
        verified: r.verified,
        postedAt: r.createdAt.toISOString(),
        comments: r.comments.map(c => ({
          id: c.id,
          userId: c.userId,
          user: {
            fullName: c.user.fullName,
            profile: {
              avatarUrl: c.user.profile?.avatarUrl
            }
          },
          body: c.body,
          createdAt: c.createdAt.toISOString()
        }))
      })),
      hours: venue.schedules.map(s => ({
        day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][s.day],
        opens: s.opens,
        closes: s.closes,
        closed: s.closed
      })),
      amenities: [] // Placeholder for amenities
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message
    })
  }
})
