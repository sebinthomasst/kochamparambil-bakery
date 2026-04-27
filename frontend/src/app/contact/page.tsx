export default function ContactPage() {
    const contactInfo = [
        { label: 'Address', value: 'Poopally Junction, Nedumudy, Ponga PO, Alappuzha', icon: '📍' },
        { label: 'Phone', value: '79073 51449 / 98468 90967 / 62823 92562', icon: '📞' },
        { label: 'WhatsApp', value: '+91 79073 51449', icon: '💬' },
        { label: 'Email', value: 'info@kochamparambilbakery.com', icon: '✉️' },
        { label: 'Opening Hours', value: '8:00 AM - 9:00 PM (Daily)', icon: '🕒' },
    ];

    return (
        <div className="pt-32 pb-20 bg-background min-h-screen">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-secondary text-center mb-16">Get In Touch</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Contact Details */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-xl p-10">
                            <h2 className="text-2xl font-bold text-secondary mb-8">Contact Information</h2>
                            <div className="space-y-6">
                                {contactInfo.map((info, idx) => (
                                    <div key={idx} className="flex items-start space-x-4">
                                        <span className="text-3xl">{info.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">{info.label}</h3>
                                            <p className="text-lg text-secondary font-medium">{info.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-12 flex space-x-4">
                                <a href="https://wa.me/917907351449" className="btn-primary flex-1 text-center">
                                    WhatsApp Us
                                </a>
                                <a href="tel:+917907351449" className="bg-secondary text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition text-center flex-1">
                                    Call Now
                                </a>
                            </div>
                        </div>

                        <div className="bg-primary bg-opacity-30 rounded-3xl p-10 border border-primary">
                            <h3 className="text-xl font-bold text-secondary mb-4">Visit Our Shop</h3>
                            <p className="text-secondary leading-relaxed mb-6">
                                We are located at the heart of Nedumudy, easily accessible from Alappuzha town. Drop by to see our freshest cakes of the day!
                            </p>
                            <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Bakery Display" className="rounded-2xl shadow-md w-full h-48 object-cover" />
                        </div>
                    </div>

                    {/* Map */}
                    <div className="h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15735.667794017355!2d76.3768798!3d9.432657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08836df3f48a7b%3A0xe67ce96769e59d99!2sPooppally%20Junction!5e0!3m2!1sen!2sin!4v1711283647000!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={true} 
                            loading="lazy" 
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
